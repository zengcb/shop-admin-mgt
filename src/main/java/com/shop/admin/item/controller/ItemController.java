package com.shop.admin.item.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.shop.admin.item.entity.Item;
import com.shop.admin.item.service.ItemService;

@Controller
public class ItemController {
    
	@Autowired
	private ItemService itemService;
	
	@RequestMapping("/item/list")
	public ModelAndView toItemList() throws Exception{
		ModelAndView model=new ModelAndView("basic/item/goods-list");
		Item item  = new Item();
		item.setCostPrice(100);
		item.setCreateTime(System.currentTimeMillis());
		item.setSellPrice(200);
		item.setName("test");
		item.setNum(10);
		item.setUpdateTime(System.currentTimeMillis());
		itemService.insert(item);
		return model;
	}
}
