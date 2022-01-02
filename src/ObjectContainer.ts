export type ObjectContainerConfiguration = {
	convertAllKeysToLowerCase: boolean,
	convertAllValuesToLowerCase: boolean,
};

export class ObjectContainer<T> {

	public data: T | any = {};

	public config: ObjectContainerConfiguration = {
		convertAllKeysToLowerCase   : false,
		convertAllValuesToLowerCase : false,
	};

	constructor(data?: T, configuration?: ObjectContainerConfiguration) {
		this.data = data ?? {};

		if (configuration) {
			if (configuration.convertAllKeysToLowerCase) {
				this.config.convertAllKeysToLowerCase = configuration.convertAllKeysToLowerCase;
			}
			if (configuration.convertAllValuesToLowerCase) {
				this.config.convertAllValuesToLowerCase = configuration.convertAllValuesToLowerCase;
			}
		}

		this.prepareData();
	}

	/**
	 * If we wish to use keys as lower case or values as lower case.
	 * This will process our data when the class is initiated.
	 *
	 * @private
	 */
	public prepareData() {
		if (!this.config.convertAllValuesToLowerCase && !this.config.convertAllKeysToLowerCase) {
			return;
		}

		let data: any = {};

		for (let dataKey in this.data) {
			let value: any = this.data[dataKey];
			let key: any   = dataKey;

			if (this.config.convertAllValuesToLowerCase && typeof value === 'string') {
				value = value.toLowerCase();
			}

			if (this.config.convertAllKeysToLowerCase) {
				key = dataKey.toLowerCase();
			}

			data[key] = value;
		}

		this.data = data;
	}

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public has(key: string): boolean;

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @template T
	 * @param {string} key
	 * @param {T|undefined} value
	 * @return {boolean}
	 */
	public has(key: string, value: T): boolean;

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @template T
	 * @param {string} key
	 * @param {T|undefined} value
	 * @return {boolean}
	 */
	public has(key: string, value?: T): boolean {
		key   = this.convertKey(key);
		value = this.convertValue(value) as T;

		if (value !== undefined) {
			if (this.data[key] === undefined) {
				return false;
			}

			return this.data[key] === value;
		}

		return this.data[key] !== undefined;
	}

	/**
	 * Get the value from the container by it's key
	 *
	 * @template T
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public get(key: string, _default: any = null): T {
		key = this.convertKey(key);

		return (this.data[key] ?? _default) as T;
	}

	/**
	 * Put a value into the container, if a value with the same key already exists, it will be overwritten.
	 *
	 * @param {string} key
	 * @param value
	 * @return {ObjectContainer}
	 */
	public put(key: string, value: any): ObjectContainer<T> {
		key   = this.convertKey(key);
		value = this.convertValue(value) as T;

		this.data[key] = value;

		return this;
	}

	/**
	 * If an item exists with the same key, the value will not be added and we'll return false.
	 * If an item doesn't exist and we added the value, we'll return true.
	 *
	 * @param {string} key
	 * @param value
	 * @return {boolean}
	 */
	public putIfNotExists(key: string, value: any): boolean {
		if (this.has(key)) {
			return false;
		}

		key   = this.convertKey(key);
		value = this.convertValue(value) as T;

		this.put(key, value);

		return true;
	}

	/**
	 * If an item exists by the key, remove it
	 *
	 * @param {string} key
	 * @return {ObjectContainer}
	 */
	public forget(key: string): ObjectContainer<T> {

		if (!this.has(key)) {
			return this;
		}

		key = this.convertKey(key);

		delete this.data[key];

		return this;
	}

	/**
	 * Does the same as {@link forget}, this method just calls forget.
	 *
	 * @param {string} key
	 */
	public remove(key: string) {
		return this.forget(key);
	}

	/**
	 * Remove all items from the object
	 */
	public clear() {
		this.data = {};
	}

	/**
	 * Get all items from the container
	 *
	 * @template T
	 * @return {T}
	 */
	public items(): T {
		return this.data;
	}

	/**
	 * Same as {@link items}, just feels more convenient to use
	 *
	 * @template T
	 * @return {T}
	 */
	public all(): T {
		return this.items();
	}

	/**
	 * Get all keys of the object
	 *
	 * @return {string[]}
	 */
	public keys(): string[] {
		return Object.keys(this.data);
	}

	/**
	 * Get all values, without their keys as an array
	 *
	 * @template T
	 * @return {T[]}
	 */
	public values(): T[] {
		return Object.values(this.data) as T[];
	}

	/**
	 * Do we have any items?
	 * @returns {boolean}
	 */
	public empty(): boolean {
		return !this.keys()?.length;
	}

	public convertKey(key: string) {
		if (this.config.convertAllKeysToLowerCase) {
			key = key.toLowerCase();
		}

		return key;
	}

	public convertValue(value: T | string): T | string {
		if (this.config.convertAllValuesToLowerCase && value !== undefined) {
			return (typeof value === 'string' ? value.toLowerCase() : value) as T;
		}

		return value;
	}

	/**
	 * Reset the store and populate it with key->value items
	 *
	 * @template T
	 * @param {object} values
	 * @return {ObjectContainer<T>}
	 */
	public populate(values: { [key: string]: any }): ObjectContainer<T> {
		const data = {};

		for (let key in values) {
			data[key] = values[key];
		}

		this.data = data;

		return this;
	}
}
