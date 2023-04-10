# HydrogenServer
A Minecraft server implementation written in pure Typescript

This is a side project of mine which I started to explore the Minecraft protocol and familiarize with some basic networking.

It features a full client and server bound packet buffer implementation capable of serializing all of the Minecraft protocol types and is easily extendable.
The full status, handshake, and login sequence is implemented (minus the encryption step), and many of the play packets have been implemented.

The vanilla registry implementations are hard to emulate without Java's native implementation of the used data structures, so instead the registry enums are codegened from the official protocol JSON files.

The codebase also features a high amount of test coverage in areas that deal with crucial elements such as packet serialization.
