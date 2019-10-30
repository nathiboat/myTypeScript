type VirtualQueue = {
    itemId : number,
    staffId : number,
    expireInSeconds?: number,
    ttl? : string
}

export default VirtualQueue