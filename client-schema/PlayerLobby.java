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
public class PlayerLobby extends Schema {
	@SchemaField("0/string")	
	public String id = "";

	@SchemaField("1/string")	
	public String pseudo = "";

	@SchemaField("2/boolean")	
	public boolean is_ready = false;

	@SchemaField("3/string")	
	public String avatarUrl = "";
}

