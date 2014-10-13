package client.views;

import java.util.List;

import javax.swing.DefaultListModel;
import javax.swing.JComponent;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionListener;

public class MultiSelector<T> implements ViewComponent {
	
	private final DefaultListModel<T> model;
	private final JList<T> list;
	
	private final JPanel panel = new JPanel();
	
	public MultiSelector() {
		model = new DefaultListModel<T>();
		list = new JList<T>(model);
		panel.add(new JScrollPane(list));
	}

	@Override
	public JComponent getComponent() {
		return panel;
	}
	
	public void add(T item){
		model.addElement(item);
	}
	
	public List<T> getSelectedItems(){
		return list.getSelectedValuesList();
	}
	
	public void clear(){
		model.clear();
	}
	
	public void addListSelectionListener(ListSelectionListener l){
		list.addListSelectionListener(l);
	}
	
	public void updateItems(List<T> items){
		clear();
		for (T item : items){
			add(item);
		}
	}
}
