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
public class Message extends Schema {
	@SchemaField("0/string")	
	public String id = "";

	@SchemaField("1/string")	
	public String text = "";

	@SchemaField("2/string")	
	public String sender = "";

	@SchemaField("3/int64")	
	public long time = 0;
}

