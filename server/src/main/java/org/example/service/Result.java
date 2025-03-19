package org.example.service;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Result <T> {

    private T payload;
    private List<String> errorMessages = new ArrayList<>();;
    private HttpStatus httpStatus;

    public Result() {
    }

    public void addErrorMessage(String format, HttpStatus resultType, Object... args) {
        this.httpStatus = resultType;
        errorMessages.add(String.format(format, args));
    }

    public boolean isSuccess() {
        return errorMessages.isEmpty();
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    public List<String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(List<String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Result<?> result = (Result<?>) o;
        return Objects.equals(payload, result.payload) && Objects.equals(errorMessages, result.errorMessages) && httpStatus == result.httpStatus;
    }

    @Override
    public int hashCode() {
        return Objects.hash(payload, errorMessages, httpStatus);
    }
}
