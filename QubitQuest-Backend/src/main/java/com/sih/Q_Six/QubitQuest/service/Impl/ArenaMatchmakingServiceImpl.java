package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.arena.MatchmakingResponse;
import com.sih.Q_Six.QubitQuest.entity.ArenaMatch;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import com.sih.Q_Six.QubitQuest.enums.ArenaMatchStatus;
import com.sih.Q_Six.QubitQuest.enums.MatchmakingStatus;
import com.sih.Q_Six.QubitQuest.repository.ArenaMatchRepository;
import com.sih.Q_Six.QubitQuest.service.ArenaGameService;
import com.sih.Q_Six.QubitQuest.service.ArenaMatchmakingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArenaMatchmakingServiceImpl implements ArenaMatchmakingService {

    private final StringRedisTemplate redisTemplate;
    private final ArenaMatchRepository arenaMatchRepository;
    private final ArenaGameService arenaGameService;

    private static final String QUEUE_PREFIX = "arena:queue:";
    private static final String MEMBER_SUFFIX = ":members";


    @Override
    public MatchmakingResponse joinQueue(
            Long userId,
            ArenaGameMode mode
    ) {

        String queueKey = getQueueKey(mode);
        String memberKey = getMemberKey(mode);

        /*
         * Prevent the same user from joining the same queue
         * multiple times.
         */
        Boolean alreadyWaiting = redisTemplate
                .opsForSet()
                .isMember(memberKey, userId.toString());

        if (Boolean.TRUE.equals(alreadyWaiting)) {
            return new MatchmakingResponse(
                    MatchmakingStatus.WAITING,
                    null,
                    "You are already waiting for an opponent."
            );
        }

        /*
         * Try to find an opponent.
         */
        String opponentId = redisTemplate
                .opsForList()
                .leftPop(queueKey);

        if (opponentId == null) {

            /*
             * Nobody is waiting.
             * Add current player to queue.
             */
            redisTemplate
                    .opsForList()
                    .rightPush(queueKey, userId.toString());

            redisTemplate
                    .opsForSet()
                    .add(memberKey, userId.toString());

            return new MatchmakingResponse(
                    MatchmakingStatus.WAITING,
                    null,
                    "Waiting for an opponent..."
            );
        }

        /*
         * Remove opponent from membership set.
         */
        redisTemplate
                .opsForSet()
                .remove(memberKey, opponentId);

        Long opponentUserId = Long.parseLong(opponentId);

        /*
         * Create the actual match in the database.
         */
        ArenaMatch match = new ArenaMatch();

        match.setMode(mode);
        match.setStatus(ArenaMatchStatus.COUNTDOWN);
        match.setPlayer1Id(opponentUserId);
        match.setPlayer2Id(userId);

        ArenaMatch savedMatch = arenaMatchRepository.save(match);

        arenaGameService.initializeMatch(
                savedMatch.getId()
        );

        return new MatchmakingResponse(
                MatchmakingStatus.MATCH_FOUND,
                savedMatch.getId(),
                "Match found!"
        );
    }


    @Override
    public void leaveQueue(
            Long userId,
            ArenaGameMode mode
    ) {

        String queueKey = getQueueKey(mode);
        String memberKey = getMemberKey(mode);

        /*
         * Remove user from Redis queue.
         */
        redisTemplate
                .opsForList()
                .remove(queueKey, 0, userId.toString());

        /*
         * Remove user from membership set.
         */
        redisTemplate
                .opsForSet()
                .remove(memberKey, userId.toString());
    }


    private String getQueueKey(ArenaGameMode mode) {
        return QUEUE_PREFIX + mode.name();
    }


    private String getMemberKey(ArenaGameMode mode) {
        return QUEUE_PREFIX + mode.name() + MEMBER_SUFFIX;
    }
}
