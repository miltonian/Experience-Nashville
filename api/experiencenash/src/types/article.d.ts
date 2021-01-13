declare namespace ArticleAPI {
  export interface ArticleTag {
    id: number;
    name: string;
    articleId?: number;
  }
  export interface Article {
    id: number;
    title: string;
    subtitle: string;
    authorId?: number;
    description: string;
    images?: string[];
    tags: ArticleTag[];
    createdAt: string;
  }
}
