class RollingArray<T> extends Array<T> {
    private maxSize: number

    constructor(size: number) {
        super()
        this.maxSize = size
    }

    /**
     * Add an item to the beginning of the array and removes the last item
     */
    insert(item: T) {
        this.unshift(item)

        if (this.length > this.maxSize) {
            this.pop()
        }
    }
}

export default RollingArray
