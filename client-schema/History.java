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
public class History extends Schema {
	@SchemaField("0/array/ref")	
	public ArraySchema<Action> actions = new ArraySchema<>(Action.class);

	@SchemaField("1/array/ref")	
	public ArraySchema<Move> moves = new ArraySchema<>(Move.class);
}

