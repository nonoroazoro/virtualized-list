/**
 * Provides a mechanism for releasing resources.
 */
export interface IDisposable
{
    /**
     * Releases resources.
     */
    dispose(): void;
}
