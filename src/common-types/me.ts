export interface Me {
    role: "admin" | "user" | "anonymous";
    pages?: Array<{
      path: string;
      title: string;
    }>;
  }
  