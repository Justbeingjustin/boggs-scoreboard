export interface CreateScoreboardRequest {
    ScoreRows: ScoreRow[];

}

export interface ScoreRow {
    Name: string;
    Score: number;
}