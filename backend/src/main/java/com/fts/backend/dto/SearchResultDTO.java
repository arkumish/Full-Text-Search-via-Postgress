package com.fts.backend.dto;


public class SearchResultDTO {
    private Long id;
    private String title;
    private String body;
    private Double rank;

    public SearchResultDTO(Long id, String title, String body, Double rank) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.rank = rank;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Double getRank() { return rank; }
}