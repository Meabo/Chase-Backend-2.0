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
public class Player extends Schema {
	@SchemaField("0/string")	
	public String pseudo = "";

	@SchemaField("1/number")	
	public float lat = 0;

	@SchemaField("2/number")	
	public float lon = 0;

	@SchemaField("3/number")	
	public float score = 0;

	@SchemaField("4/number")	
	public float distance = 0;
}

