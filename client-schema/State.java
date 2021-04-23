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
public class State extends Schema {
	@SchemaField("0/array/ref")	
	public ArraySchema<History> history = new ArraySchema<>(History.class);
}

