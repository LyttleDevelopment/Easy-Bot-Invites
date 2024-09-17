function createStringExtensions(): void {
  String.prototype.render = function (
    prefix: string,
    values: Record<string, Primitive>,
  ): string {
    const prefixInserted = prefix.insert(values);
    const messageInserted = this.insert(values);
    return prefixInserted + messageInserted;
  };

  String.prototype.insert = function (
    values: Record<string, Primitive>,
  ): string {
    // Get available variables
    const args = this.match(/[^{}]+(?=})/g) || [];
    // Get values to put in variables.
    const params = args.map((arg: string | undefined) => values[arg] ?? '');
    // Cut open string to put in the values.
    const parts = this.split(/\{(?!\d)[^{}\s]+}/g);
    // Return filled in string.
    return String.raw({ raw: parts }, ...params);
  };
}

export default createStringExtensions;
