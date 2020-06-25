// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.34
// 


import io.colyseus.serializer.schema.Schema;
import io.colyseus.serializer.schema.annotations.SchemaClass;
import io.colyseus.serializer.schema.annotations.SchemaField;

@SchemaClass
public class GameLobbySchema extends Schema {
	@SchemaField("0/string")	
	public String name = "";

	@SchemaField("1/array/ref")	
	public ArraySchema<Message> history = new ArraySchema<>(Message.class);

	@SchemaField("2/map/ref")	
	public MapSchema<PlayerLobby> players = new MapSchema<>(PlayerLobby.class);

	@SchemaField("3/string")	
	public String creator_name = "";

	@SchemaField("4/int16")	
	public short counter = 0;
}

