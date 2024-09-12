export type SignalHanlder = { (...args: any[]): void; __is_onece: boolean };

export interface SignalHolder {
  [event_name: string]: SignalContainer;
}
export interface SignalContainer {
  [id: number]: SignalHanlder;
}

// •
// • define customized event bus class
// • ------------------------------------------------------------------------------------------------------
// •
export default class SignalBus {
  signals_holder: SignalHolder;
  max_callback_id_existed: number;

  constructor() {
    this.signals_holder = {}; // - all events
    this.max_callback_id_existed = -1; // - to create next callback id
  }

  // •
  // • public methods;
  // • ------------------------------------------------------------------------------------------------------
  // •
  /**
   * = regist one handler for target event; one event can regist multiple handlers;
   * @param name
   * @param callback
   * @returns new callback id
   */
  $on(name: string, callback: Function) {
    this._check_event_existence(name); // - make sure event information obeject existed;

    return this._add_new_event_callback(name, callback); /// new_callback_id
  }
  /**
   * = regist handler just execute onece;
   * @param name
   * @param callback
   * @returns new callback id
   */
  $once(name: string, callback: SignalHanlder) {
    this._check_event_existence(name);

    return this._add_new_event_callback(name, callback, true); /// new_callback_id
  }
  $emit(name: string, ...args: any[]) {
    const handler_container = this._get_handler_container(name);

    for (const callback_id in handler_container) {
      handler_container[callback_id].apply(this, args);

      // $ delete once event;
      if (handler_container[callback_id].__is_onece) {
        delete handler_container[callback_id];
      }
    }
  }
  $off(name: string, callback_id: number) {
    delete this.signals_holder[name][callback_id];

    // $ delete all events holder
    if (!Object.keys(this.signals_holder[name]).length) {
      delete this.signals_holder[name];
    }
  }

  // •
  // • internal methods
  // • ------------------------------------------------------------------------------------------------------
  // •
  _get_handler_container(name: string) {
    return this.signals_holder[name];
  }

  _check_event_existence(name: string) {
    if (!this._get_handler_container(name)) {
      this._initial_new_event(name);
    }
  }
  _initial_new_event(name: string) {
    this.signals_holder[name] = {};
  }

  /**
   * = add new event handler to target event name;
   * - one event name has multiple handlers;
   * - every handler has its own id(number);
   * @param name
   * @param callback
   * @param is_once
   * @returns new handler id;
   */
  _add_new_event_callback(name: string, callback: Function, is_once = false) {
    let new_callback_id = ++this.max_callback_id_existed;

    if (is_once) {
      (callback as SignalHanlder).__is_onece = true;
    }

    this._get_handler_container(name)[new_callback_id] =
      callback as SignalHanlder;

    return new_callback_id; /// external logical to store callback id
  }
}
