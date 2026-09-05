package com.sih.Q_Six.QubitQuest.advice;

import com.sih.Q_Six.QubitQuest.exceptions.BadRequestException;
import com.sih.Q_Six.QubitQuest.exceptions.ResourceNotFoundException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(
            BadRequestException ex
    ) {
        log.error("Bad request", ex);

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {
        log.error("Resource not found", ex);

        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleInputValidationError(
            MethodArgumentNotValidException ex
    ) {
        List<ApiFieldError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        new ApiFieldError(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                )
                .toList();

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST,
                "Input Validation Failed",
                errors
        );

        log.error("Input validation failed", ex);

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUsernameNotFoundException(
            UsernameNotFoundException ex
    ) {
        log.error("Username not found", ex);

        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND,
                "Username not found with username: " + ex.getMessage()
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthenticationException(
            AuthenticationException ex
    ) {
        log.error("Authentication failed", ex);

        ApiError apiError = new ApiError(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed: " + ex.getMessage()
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<?>> handleJwtException(
            JwtException ex
    ) {
        log.error("Invalid JWT token", ex);

        ApiError apiError = new ApiError(
                HttpStatus.UNAUTHORIZED,
                "Invalid JWT token: " + ex.getMessage()
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(
            AccessDeniedException ex
    ) {
        log.error("Access denied", ex);

        ApiError apiError = new ApiError(
                HttpStatus.FORBIDDEN,
                "Access denied: Insufficient permissions"
        );

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<?>> handleResponseStatusException(
            ResponseStatusException ex
    ) {
        ApiError apiError = new ApiError(
                HttpStatus.valueOf(ex.getStatusCode().value()),
                ex.getReason()
        );

        log.error("ResponseStatusException", ex);

        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleInternalServerError(
            Exception ex
    ) {
        log.error("Unexpected error occurred", ex);

        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );

        return buildErrorResponseEntity(apiError);
    }

    private ResponseEntity<ApiResponse<?>> buildErrorResponseEntity(
            ApiError apiError
    ) {
        ApiResponse<?> response = new ApiResponse<>(apiError);

        return ResponseEntity
                .status(apiError.status())
                .body(response);
    }
}