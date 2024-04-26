declare module 'gif-encoder-2' {
    class GIFEncoder {
        constructor(width: number, height: number);
        start(): void;
        setRepeat(repeat: number): void;
        setDelay(delay: number): void;
        setQuality(quality: number): void;
        addFrame(frameData: Buffer, options?: { copy?: boolean }): void;
        finish(): void;
        out: {
            getData: () => Buffer;
        };
    }

    export = GIFEncoder;
}