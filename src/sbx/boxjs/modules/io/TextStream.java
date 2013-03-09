package sbx.boxjs.modules.io;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

public class TextStream {
	
	private BufferedReader reader;
	private PrintWriter writer;
	
	private boolean readable = false;
	private boolean writable = false;
	
	private TextStream(String path, String type) throws Exception {
		File file = new File(path);
		this.readable = file.canRead();
		this.writable = file.canWrite();
		
		if (type.contains("R")) {
			this.reader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
		}
		
		if (type.contains("W")) {
			this.writer = new PrintWriter(file, "UTF-8");
		}
	}
	
	public static TextStream create(String path, String type) throws Exception {
		return new TextStream(path, type);
	}
	
	public String readLine() throws Exception {
		return reader.readLine();
	}
	
	public void writeLine(String line) throws Exception {
		writer.println(line);
	}
	
	public boolean readable() {
		return readable;
	}
	
	public boolean writable() {
		return writable;
	}

	public boolean closed() throws Exception {
		return !reader.ready();
	}

	public boolean seekable() {
		return false;
	}

	public long skip(long n) throws Exception {
		return reader.skip(n);
	}
	
	public void flush() throws Exception {
		writer.close();
	}

	public void close() throws Exception {
		if (reader != null) {
			reader.close();
		}
		
		if (writer != null) {
			writer.close();
		}
	}
	
}
