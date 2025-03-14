package com.fts.backend;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public List<SearchResultDTO> search(@RequestParam String query, @RequestParam Integer type) {
        if(type==1)
            return searchService.searchQuestionswithLike(query);

        return searchService.searchQuestions(query);
    }
}

