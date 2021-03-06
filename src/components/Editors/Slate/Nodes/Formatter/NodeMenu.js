// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';
import { Popover, Input, Menu } from 'antd';

const menuSize = 25;
const MenuButton = styled.div`
  width: ${menuSize}px;
  height: ${menuSize}px;
  text-align: center;
  border-radius: 2px;

  position: absolute;
  left: ${-(menuSize + 10)}px;
  top: 5px;

  cursor: grab;
  user-select: none;

  span {
    color: gray;
    font-size: ${menuSize}px;
  }

  transition: all 600ms cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity: 0;
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Container = styled.div`
  position: relative;

  &:hover {
    ${MenuButton} {
      opacity: 1;
    }
  }
`;

type Props = {
  value: { change: Function },
  node: Object,
  onChange: Function,
  children: string | Element<any>,
};
export default class NodeMenu extends Component<Props> {
  menuSearch = <Input.Search placeholder="现在还用不了，以后可以过滤菜单" onSearch={value => console.log(value)} />;

  /**
   * When a mark button is clicked, toggle the current mark.
   */
  onClickNodeType(type: string) {
    const { value, onChange, node } = this.props;
    const change = value.change().setNodeByKey(node.key, type);
    onChange(change);
  }

  onClickInlineNodeType(type: string) {
    const { value, onChange, node } = this.props;
    const hasInlineNode = node.nodes.some(subNode => subNode.type === type);
    if (hasInlineNode) {
      onChange(
        value.change().withoutNormalization(c => node.nodes.forEach(subNode => c.unwrapInlineByKey(subNode.key, type))),
      );
    } else {
      onChange(
        value.change().withoutNormalization(c => node.nodes.forEach(subNode => c.wrapInlineByKey(subNode.key, type))),
      );
    }
  }

  /**
   * Render a mark-toggling toolbar button.
   */
  renderNodeButton(type: string, icon: string, inline?: boolean): React$Element<*> {
    return (
      <Menu.Item key={type} onClick={() => (inline ? this.onClickInlineNodeType(type) : this.onClickNodeType(type))}>
        <span>
          <span className="material-icons">{icon}</span>
          <span>{type}</span>
        </span>
      </Menu.Item>
    );
  }

  menu = (
    <Menu mode="vertical">
      <Menu.SubMenu
        key="node-type"
        title={
          <span>
            <span className="material-icons">compare_arrows</span>
            <span>节点类型</span>
          </span>
        }
      >
        <Menu.ItemGroup title="文档">
          {this.renderNodeButton('title', 'title')}
          {this.renderNodeButton('paragraph', 'subject')}
          {this.renderNodeButton('code_block', 'code')}
        </Menu.ItemGroup>
        <Menu.ItemGroup title="索引">{this.renderNodeButton('note-list', 'device_hub')}</Menu.ItemGroup>
        <Menu.ItemGroup title="按钮">{this.renderNodeButton('new-note-button', 'add_box')}</Menu.ItemGroup>
        <Menu.ItemGroup title="分析">{this.renderNodeButton('parse', 'power_input', true)}</Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );

  render() {
    const { children } = this.props;
    if (!children) return null;
    return (
      <Container>
        <Popover content={this.menu} title={this.menuSearch} trigger="click">
          <MenuButton role="button" tabindex="0" contenteditable={false}>
            <span className="material-icons">drag_indicator</span>
          </MenuButton>
        </Popover>
        {children}
      </Container>
    );
  }
}
