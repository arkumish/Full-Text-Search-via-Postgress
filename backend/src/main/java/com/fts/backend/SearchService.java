package com.fts.backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<SearchResultDTO> searchQuestionswithLike(String queryText) {
        String sql = "SELECT id, title, body FROM posts_info WHERE title ILIKE :query OR body ILIKE :query ";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("query", "%" + queryText + "%"); // Adding wildcard for LIKE search

        List<Object[]> results = query.getResultList();

        return results.stream().map(result ->
                new SearchResultDTO(
                        ((Number) result[0]).longValue(),  // id
                        (String) result[1],                // title
                        (String) result[2],                // body
                        (double) 0 // rank
                )
        ).collect(Collectors.toList());
    }

    public List<SearchResultDTO> searchQuestions(String queryText) {
        Query query = entityManager.createNativeQuery(
                "SELECT id, title, body, rank FROM search_questions(:query)"
        );
        query.setParameter("query", queryText);

        List<Object[]> results = query.getResultList();

        return results.stream().map(result ->
                new SearchResultDTO(
                        ((Number) result[0]).longValue(),  // id
                        (String) result[1],                // title
                        (String) result[2],                // body
                        ((Number) result[3]).doubleValue() // rank
                )
        ).collect(Collectors.toList());
    }
}
