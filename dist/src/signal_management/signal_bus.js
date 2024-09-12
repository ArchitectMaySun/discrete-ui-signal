export default class SignalBus {
    constructor() {
        this.signals_holder = {};
        this.max_callback_id_existed = -1;
    }
    $on(name, callback) {
        this._check_event_existence(name);
        return this._add_new_event_callback(name, callback);
    }
    $once(name, callback) {
        this._check_event_existence(name);
        return this._add_new_event_callback(name, callback, true);
    }
    $emit(name, ...args) {
        const handler_container = this._get_handler_container(name);
        for (const callback_id in handler_container) {
            handler_container[callback_id].apply(this, args);
            if (handler_container[callback_id].__is_onece) {
                delete handler_container[callback_id];
            }
        }
    }
    $off(name, callback_id) {
        delete this.signals_holder[name][callback_id];
        if (!Object.keys(this.signals_holder[name]).length) {
            delete this.signals_holder[name];
        }
    }
    _get_handler_container(name) {
        return this.signals_holder[name];
    }
    _check_event_existence(name) {
        if (!this._get_handler_container(name)) {
            this._initial_new_event(name);
        }
    }
    _initial_new_event(name) {
        this.signals_holder[name] = {};
    }
    _add_new_event_callback(name, callback, is_once = false) {
        let new_callback_id = ++this.max_callback_id_existed;
        if (is_once) {
            callback.__is_onece = true;
        }
        this._get_handler_container(name)[new_callback_id] =
            callback;
        return new_callback_id;
    }
}
//# sourceMappingURL=signal_bus.js.map