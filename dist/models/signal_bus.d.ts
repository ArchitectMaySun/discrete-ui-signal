export type SignalHanlder = {
    (...args: any[]): void;
    __is_onece: boolean;
};
export interface SignalHolder {
    [event_name: string]: SignalContainer;
}
export interface SignalContainer {
    [id: number]: SignalHanlder;
}
