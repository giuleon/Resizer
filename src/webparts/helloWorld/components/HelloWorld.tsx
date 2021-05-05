import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Announced } from '@fluentui/react/lib/Announced';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Text } from '@fluentui/react/lib/Text';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardTitle,
  DocumentCardLogo,
  DocumentCardStatus,
  IDocumentCardLogoProps,
  IDocumentCardActivityPerson,
  IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

export interface IDetailsListBasicExampleItem {
  key: number;
  name: string;
  value: number;
  category: string;
  department: string;
}

export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}

const cardStyles: IDocumentCardStyles = {
  root: { display: 'inline-block', marginRight: 20, width: 320, marginTop: 5, },
};

const conversationTileClass = mergeStyles({ height: 182 });

export default class HelloWorld extends React.Component<IHelloWorldProps, IDetailsListBasicExampleState> {
  private _selection: Selection;
  private _allItems: IDetailsListBasicExampleItem[];
  private _columns: IColumn[];

  constructor(props: IHelloWorldProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    // Populate with items for demos.
    this._allItems = [];
    for (let i = 0; i < 20; i++) {
      this._allItems.push({
        key: i,
        name: 'Item ' + i,
        value: i,
        category: 'category',
        department: 'department',
      });
    }

    this._columns = [
      { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 200, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Value', fieldName: 'value', minWidth: 200, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Category', fieldName: 'category', minWidth: 300, maxWidth: 300, isResizable: true },
      { key: 'column4', name: 'Department', fieldName: 'department', minWidth: 300, maxWidth: 300, isResizable: true },
    ];

    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
    };
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    const { items, selectionDetails } = this.state;
    let grid;
    let cards: any[] = [];
    if (this.props.newWidth < 1200) {
      for (let index = 0; index < this._allItems.length; index++) {
        const element = this._allItems[index];
        cards.push(
          <DocumentCard
            aria-label={
              'Document Card with logo and text preview. Conversation about annual report. Content preview. ' +
              'Sent by Velatine Lourvric and 1 other in March 13, 2018.'
            }
            styles={cardStyles}
            onClickHref="http://bing.com"
          >
            <div className={conversationTileClass}>
              <DocumentCardTitle title={element.name} shouldTruncate />
              <DocumentCardTitle
                title={element.value.toString()}
                shouldTruncate
                showAsSecondaryTitle
              />
            </div>
          </DocumentCard>);
      }
      grid =
        <div>
          {cards}
        </div>;
    } else {
      grid =
        <div>
          <div className={exampleChildClass}>{selectionDetails}</div>
          <Text>
            Note: While focusing a row, pressing enter or double clicking will execute onItemInvoked, which in this
            example will show an alert.
          </Text>
          <Announced message={selectionDetails} />
          <TextField
            className={exampleChildClass}
            label="Filter by name:"
            onChange={this._onFilter}
            styles={textFieldStyles}
          />
          <Announced message={`Number of items after filter applied: ${items.length}.`} />
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
              onItemInvoked={this._onItemInvoked}
            />
          </MarqueeSelection>
        </div>;
    }

    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>{this.props.newWidth}</span>
              </a>
            </div>
          </div>
        </div>
        {grid}
      </div>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
    });
  }

  private _onItemInvoked = (item: IDetailsListBasicExampleItem): void => {
    alert(`Item invoked: ${item.name}`);
  }
}
