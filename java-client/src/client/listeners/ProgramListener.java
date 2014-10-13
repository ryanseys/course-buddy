package client.listeners;

import java.util.List;

import client.models.Program;

public interface ProgramListener {
	
	public void updatePrograms(List<Program> programs);
	public void selectProgram(Program program, boolean onPattern);

}
