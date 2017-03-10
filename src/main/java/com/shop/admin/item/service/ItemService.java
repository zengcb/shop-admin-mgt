package com.shop.admin.item.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.admin.item.dao.ItemMapper;
import com.shop.admin.item.entity.Item;

@Service
public class ItemService {
  @Autowired
  private ItemMapper itemMapper;
  
  public int insert(Item item){
	 return itemMapper.insert(item);
  }
}
