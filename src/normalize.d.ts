declare module './normalize' {
    function normalize(str: string, custom_charmap?: { [key: string]: string }): string;
    export = normalize;
}