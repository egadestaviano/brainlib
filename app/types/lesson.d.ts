declare global {
  interface Lessons {
    id: number;
    class_id: number;
    title: string;
    summary: string;
    content: any;
    content_json: ContentJson[];
    author_id: number;
    is_published: boolean;
  }

  type ContentJson =
    | ContentJsonBlock
    | ContentJsonImageBlock
    | ContentJsonVideoBlock
    | ContentJsonMultipleChoiceBlock
    | ContentJsonEssayBlock;

  interface ContentJsonBlock {
    type: "text";
    title: string;
    content: string;
  }

  interface ContentJsonImageBlock {
    type: "image";
    title: string;
    url: string;
    alt?: string;
  }

  interface ContentJsonVideoBlock {
    type: "video";
    title: string;
    url: string;
  }

  interface ContentJsonMultipleChoiceOption {
    label: string;
    value: string;
    is_correct: boolean;
  }

  interface ContentJsonMultipleChoiceBlock {
    type: "multiple_choice";
    title: string;
    options: ContentJsonMultipleChoiceOption[];
    explanation?: string;
  }

  interface ContentJsonEssayBlock {
    type: "essay";
    title: string;
    placeholder?: string;
    max_length?: number;
    explanation?: string;
  }

  interface LessonCreate {
    class_id: number;
    title: string;
    summary: string;
    content: any;
    content_json: ContentJson[];
    author_id: number;
    is_published: boolean;
  }
}

export {};
