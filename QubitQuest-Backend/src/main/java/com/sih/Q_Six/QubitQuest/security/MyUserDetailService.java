package com.sih.Q_Six.QubitQuest.security;

import com.sih.Q_Six.QubitQuest.entity.User;
import com.sih.Q_Six.QubitQuest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailService  implements UserDetailsService {
      private  final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       User user=userRepository.
               findByEmail(username)
               .orElseThrow(()->new UsernameNotFoundException("User not found"));
       return new UserPrincipal(user);
    }
}
