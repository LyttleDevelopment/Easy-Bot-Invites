type Primitive = string | number | boolean | null | undefined;

interface String extends String {
  render: (prefix: string, values: Record<string, Primitive>) => string;
  insert: (values: Record<string, Primitive>) => string;
}

interface Date extends Date {
  getWeek: () => number;
  getWeekYear: () => number;
}
