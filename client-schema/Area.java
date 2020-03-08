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
public class Area extends Schema {
	@SchemaField("0/ref")	
	public Location location = new Location();

	@SchemaField("1/array/ref")	
	public ArraySchema<Location> bounds = new ArraySchema<>(Location.class);

	@SchemaField("2/string")	
	public String name = "";
}

