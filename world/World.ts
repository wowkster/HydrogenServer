import Identifier from '../datatypes/Identifier'
import S2CDestroyEntitiesPacket from '../network/packets/play/S2CDestroyEntitiesPacket'
import S2CPacket from '../network/packets/S2CPacket'

import Entity from '../entity/Entity'

// import ArmorStandEntity from '../entity/decoration/ArmorStandEntity'
// import ChickenEntity from '../entity/passive/ChickenEntity'
// import CowEntity from '../entity/passive/CowEntity'
// import PigEntity from '../entity/passive/PigEntity'
// import SheepEntity from '../entity/passive/SheepEntity'
import Player from '../entity/player/Player'

export default class World {
    static OVERWORLD = new World(new Identifier('overworld'))

    readonly id: Identifier

    entities: Set<Entity>

    constructor(id: Identifier) {
        this.id = id

        this.entities = new Set()

        // this.addEntity(new ArmorStandEntity(0, 0, 0))
        // this.addEntity(new PigEntity(1, 0, 0))
        // this.addEntity(new CowEntity(2, 0, 0))
        // this.addEntity(new SheepEntity(3, 0, 0))
        // this.addEntity(new ChickenEntity(4, 0, 0))
    }

    tick() {
        for (const entity of this.entities) {
            entity.tick()
        }
    }

    /**
     * Add entity to internal list, and tells clients about a new entity being spawned in the world
     */
    addEntity(entity: Entity) {
        this.entities.add(entity)

        // Send spawn packet
        this.emitPacketToPlayersInRangeOfEntity(entity.createSpawnPacket(), entity)

        // TODO Send entity metadata packet
    }

    /**
     * Removes the entity from the internal list, and tells clients that it was removed
     */
    removeEntity(entity: Entity): boolean {
        if (!this.entities.delete(entity)) return false

        // Send entity de-spawn packet
        this.emitPacketToPlayersInRangeOfEntity(S2CDestroyEntitiesPacket.fromEntity(entity), entity)

        return true
    }

    getEntitiesInViewableRangeOfPlayer(player: Player) {
        const res = []

        for (const entity of this.entities) {
            if (entity.isInRange(player, 128)) {
                res.push(entity)
            }
        }

        return res
    }

    getPlayersInViewableRangeOfEntity(entity: Entity) {
        const res = []

        for (const player of this.players) {
            if (player.isInRange(entity, 128)) {
                res.push(player)
            }
        }

        return res
    }

    emitPacketToAllPlayers(packet: S2CPacket) {
        for (const player of this.players) {
            player.client.sendPacket(packet)
        }
    }

    /**
     * Emits a packet to players within visible range of an entity
     *
     * **If the entity argument is a Player, the packet will not be sent to that player**
     */
    emitPacketToPlayersInRangeOfEntity(packet: S2CPacket, entity: Entity) {
        const playersInRange = this.getPlayersInViewableRangeOfEntity(entity)

        for (const player of playersInRange) {
            if (player === entity) continue
            player.client.sendPacket(packet)
        }
    }

    get players(): Player[] {
        // TS cant type check this for some reason?
        return [...this.entities].filter(e => e instanceof Player) as Player[]
    }
}
