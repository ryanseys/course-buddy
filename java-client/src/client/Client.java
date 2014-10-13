package client;

import javax.swing.JFrame;

import client.controllers.MainViewController;
import client.models.Constants;
import client.views.MainView;

public class Client {
	
	public static void main(String[] args){
		// Setup views
		MainView mainView = new MainView();
		
		// setup frame
		JFrame frame = new JFrame(Constants.APP_NAME);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.add(mainView.getComponent());
		frame.pack();
		
		// setup controllers
		MainViewController mainViewController = new MainViewController();
		mainViewController.addProgramListener(mainView);
		mainViewController.addCourseListener(mainView);
		mainView.addProgramListener(mainViewController);
		mainViewController.refresh();
		
		// start
		frame.setVisible(true);
	}

}
