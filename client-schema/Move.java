// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.5
// 


import io.colyseus.serializer.schema.Schema;
import io.colyseus.serializer.schema.annotations.SchemaClass;
import io.colyseus.serializer.schema.annotations.SchemaField;

@SchemaClass
public class Move extends Schema {
	@SchemaField("0/string")	
	public String gameId = "";

	@SchemaField("1/string")	
	public String playerId = "";

	@SchemaField("2/ref")	
	public Location prevlocation = new Location();

	@SchemaField("3/ref")	
	public Location newlocation = new Location();

	@SchemaField("4/number")	
	public float timestamp = 0;

	@SchemaField("5/number")	
	public float speed = 0;
}

