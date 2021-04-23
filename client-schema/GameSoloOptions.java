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
public class GameSoloOptions extends Schema {
	@SchemaField("0/ref")	
	public ChaseObject chaseObjectLocation = new ChaseObject();

	@SchemaField("1/number")	
	public float time = 0;

	@SchemaField("2/array/ref")	
	public ArraySchema<Location> bounds = new ArraySchema<>(Location.class);
}

