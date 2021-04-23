// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.22
// 


import io.colyseus.serializer.schema.Schema;
import io.colyseus.serializer.schema.annotations.SchemaClass;
import io.colyseus.serializer.schema.annotations.SchemaField;

@SchemaClass
public class Action extends Schema {
	@SchemaField("0/string")	
	public String gameId = "";

	@SchemaField("1/string")	
	public String playerId = "";

	@SchemaField("2/string")	
	public String status = "";

	@SchemaField("3/string")	
	public String pseudo = "";

	@SchemaField("4/string")	
	public String action = "";

	@SchemaField("5/number")	
	public float timestamp = 0;

	@SchemaField("6/ref")	
	public Location location = new Location();

	@SchemaField("7/string")	
	public String pseudoStealed = "";
}

