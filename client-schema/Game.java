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
public class Game extends Schema {
	@SchemaField("0/ref")	
	public History history = new History();

	@SchemaField("1/map/ref")	
	public MapSchema<Player> players = new MapSchema<>(Player.class);

	@SchemaField("2/boolean")	
	public boolean gameFinished = false;

	@SchemaField("3/ref")	
	public ChaseObject chaseObject = new ChaseObject();

	@SchemaField("4/ref")	
	public Player guardian = new Player();
}

