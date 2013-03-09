package sbx.boxjs.modules.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

public class Stream {
	
	private FileChannel writeChannel;
	private FileOutputStream output;
	
	private FileChannel readChannel;
	private FileInputStream input;
	
	private boolean readable = false;
	private boolean writable = false;

	private Stream(String path, String type) throws Exception {
		File file = new File(path);
		this.readable = file.canRead();
		this.writable = file.canWrite();
		
		if (type.contains("R")) {
			input = new FileInputStream(file);
			readChannel = input.getChannel();
		} 
		
		if (type.contains("W")) {
			output = new FileOutputStream(file);
			writeChannel = output.getChannel();
		}
	}
	
	public static Stream create(String path, String type) throws Exception {
		return new Stream(path, type);
	}
	
	public long length() throws Exception {
		return (readChannel != null ? readChannel : writeChannel).size();
	}

	public long position() throws Exception {
		return (readChannel != null ? readChannel : writeChannel).position();
	}

	public boolean readable() {
		return readable;
	}
	
	public boolean writable() {
		return writable;
	}

	public boolean closed() {
		return !(readChannel != null ? readChannel : writeChannel).isOpen();
	}

	public boolean seekable() {
		return true;
	}

	public long skip(long n) throws Exception {
		long pos = readChannel.position()+n;
		readChannel.position(pos);
		return pos;
	}
	
	public byte[] read(int n) throws Exception {
		ByteBuffer buffer = ByteBuffer.allocate((n != -1 ? n : (int)(length()-position())));
		readChannel.read(buffer);
		buffer.rewind();
		return buffer.array();
	}
	
	public byte read() throws Exception {
		ByteBuffer buffer = ByteBuffer.allocate(1);
		readChannel.read(buffer);
		buffer.rewind();
		return buffer.get();
	}
	
	public void write(byte[] b) throws Exception {
		writeChannel.write(ByteBuffer.wrap(b));
	}

	public void flush() throws Exception {
		if (!closed()) {
			writeChannel.force(false);
		}
	}

	public void close() throws Exception {
		if (readChannel != null) {
			readChannel.close();
			input.close();
		} else if (writeChannel != null) {
			writeChannel.close();
			output.close();
		}
	}
	
}
