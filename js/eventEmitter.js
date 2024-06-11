//event emitter
//on, off, emit, once
export class EventEmitter
{
	constructor()
	{
		this.events = {};
	}

	on(eventName, callback)
	{
		if (!this.events[eventName])
		{
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}

	off(eventName, callback)
	{
		if (!this.events[eventName])
		{
			return;
		}
		this.events[eventName] = this.events[eventName].filter(eventCallback => eventCallback !== callback);
	}

	emit(eventName, data)
	{
		if (!this.events[eventName])
		{
			return;
		}
		this.events[eventName].forEach(callback => callback(data));
	}

	once(eventName, callback)
	{
		var _this = this;
		const onceCallback = (data) =>
		{
			callback(data);
			_this.off(eventName, onceCallback);
		};
		this.on(eventName, onceCallback);
	}
}
