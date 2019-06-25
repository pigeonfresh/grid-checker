import { Breakpoint, Options } from './IGridLayout'
import { className } from './classNames'
import { cssVariableName } from './cssVariableName'

class GridChecker {
  private options: Options
  private readonly totalColumns: number
  private readonly gridClassName: string
  private readonly breakpoints: Array<Breakpoint>
  private static DISPLAY_NONE: string = 'display: none;'

  constructor(options: Options) {
    this.options = options
    this.gridClassName = options.className || className.grid
    this.breakpoints = options.breakpoints || []
    this.totalColumns = this.getTotalColumnsToCreate()

    this.createGridLayout()
    this.setupGridStyles()

    window.addEventListener('keyup', this.handleKeyUp)
  }

  private getTotalColumnsToCreate = (): number => {
    const breakpoints = this.options.breakpoints
    let columnsToCreate = this.options.columns

    if (breakpoints === undefined) return columnsToCreate

    breakpoints.forEach(breakpoint => {
      if (breakpoint.columns === undefined) return
      columnsToCreate = breakpoint.columns > columnsToCreate ? breakpoint.columns : columnsToCreate
    })

    return columnsToCreate
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (event.keyCode !== 71) return
    this.toggleGrid()
  }

  private toggleGrid = (): void => {
    const grid = window.document.querySelector(`.${this.gridClassName}`) as HTMLElement
    grid.classList.toggle(`${className.isActive}`)
  }

  private createGridLayout(): void {
    const grid = document.createElement('div')
    const gridWrapper = document.createElement('div')
    const columnList = document.createElement('ul')

    grid.className = this.gridClassName
    gridWrapper.className = className.gridWrapper
    columnList.className = className.columnList

    for (let i = 1; i <= this.totalColumns; i++) {
      const column = document.createElement('li')
      column.className = className.column
      columnList.appendChild(column)
    }

    gridWrapper.appendChild(columnList)
    grid.appendChild(gridWrapper)
    document.body.appendChild(grid)
  }

  private setupGridStyles(): void {
    document.documentElement.style.setProperty(
      cssVariableName.maxWidth,
      `${this.options.maxWidth}px`
    )
    document.documentElement.style.setProperty(cssVariableName.color, this.options.color)
    document.documentElement.style.setProperty(cssVariableName.padding, `${this.options.padding}px`)
    document.documentElement.style.setProperty(cssVariableName.gutter, `${this.options.gutter}px`)

    let style: HTMLStyleElement = document.createElement('style')

    style.setAttribute('type', 'text/css')
    style.innerHTML = ''
    style.innerText += this.createGridStyles()
    style.innerText += this.createGridWrapperStyles()
    style.innerText += this.createColumnListStyles()
    style.innerText += this.createColumnStyles()
    style.innerText += this.createCSSVariablesPerBreakpoint()
    style.innerText += this.createColumnsStyling()

    document.head.insertBefore(style, document.head.children[0])
  }

  private createCSSVariablesPerBreakpoint = (): string => {
    let styles: string = ''
    this.breakpoints.forEach(breakpoint => {
      const mq = breakpoint.threshold
      const selector = `.${this.gridClassName}`
      let cssVariables = breakpoint.gutter
        ? `${cssVariableName.gutter}: ${breakpoint.gutter}px; `
        : ''
      cssVariables += breakpoint.color ? `${cssVariableName.color}: ${breakpoint.color}; ` : ''
      cssVariables += breakpoint.padding
        ? `${cssVariableName.padding}: ${breakpoint.padding}px; `
        : ''
      styles += cssVariables ? this.mediaQueryStyles(mq, selector, cssVariables) : ''
    })

    return styles
  }

  private createColumnsStyling = () => {
    const columnBreakpoints = this.breakpoints.filter(
      breakpoint => breakpoint.columns !== undefined
    )
    if (columnBreakpoints.length === 0) return
    let styles = ''
    styles += this.getInitialColumnsSettings()
    styles += this.getInBetweenBreakpoints()
    styles += this.getUltimateColumnsSettings()

    return styles
  }

  private getInitialColumnsSettings = (): string => {
    const selector = this.getNthChildSelector(this.options.columns + 1)
    const mq = this.breakpoints[0].threshold
    const styling = GridChecker.DISPLAY_NONE
    return this.mediaQueryStyles(mq, selector, styling, false)
  }

  private getInBetweenBreakpoints = (): string => {
    let styles = ''
    const newArray = this.breakpoints
      .map((breakpoint, id) => ({
        minWidth: breakpoint.threshold,
        columns: breakpoint.columns,
        maxWidth: this.breakpoints[id + 1] ? this.breakpoints[id + 1].threshold - 1 : false
      }))
      .filter(breakpoint => breakpoint.maxWidth)

    newArray.forEach(item => {
      const { minWidth, columns, maxWidth } = item
      const selector = this.getNthChildSelector(<number>columns + 1)
      const styling = GridChecker.DISPLAY_NONE
      styles += this.getRangeMediaQuery(minWidth, <number>maxWidth, selector, styling)
    })

    return styles
  }

  private getRangeMediaQuery = (
    minWidth: number,
    maxWidth: number,
    selector: string,
    styling: string
  ): string => {
    return `@media screen and (min-width: ${minWidth}px) and (max-width: ${maxWidth}px) { ${selector} { ${styling} } }`
  }

  private getUltimateColumnsSettings = (): string => {
    const lastItem = this.breakpoints[this.breakpoints.length - 1]
    const columns = <number>lastItem.columns + 1
    const selector = this.getNthChildSelector(columns)
    const mq = lastItem.threshold
    const styling = GridChecker.DISPLAY_NONE
    return this.mediaQueryStyles(mq, selector, styling)
  }

  private getNthChildSelector = (nthChild: number): string =>
    `.${this.gridClassName} .${className.column}:nth-child(n+${nthChild})`

  private createGridStyles = (): string => {
    return (
      `.${this.gridClassName} {` +
      `position: fixed; ` +
      `top: 0; ` +
      `bottom: 0; ` +
      `left: 0; ` +
      `right: 0; ` +
      `pointer-events: none; ` +
      `z-index: 99999999; ` +
      `box-sizing: border-box;` +
      `opacity: 0;` +
      `transition: opacity 100ms linear;` +
      `}` +
      `.${this.gridClassName}.${className.isActive} { opacity: 1; }` +
      `.${this.gridClassName} * { box-sizing: border-box; }`
    )
  }

  private createGridWrapperStyles = (): string => {
    return (
      `.${this.gridClassName} .${className.gridWrapper} {` +
      `height: 100%; ` +
      `margin: 0 auto; ` +
      `position: relative; ` +
      `max-width: var(${cssVariableName.maxWidth}); ` +
      `}`
    )
  }

  private createColumnListStyles = (): string => {
    return (
      `.${this.gridClassName} .${className.columnList} {` +
      `width: 100%; ` +
      `height: 100%; ` +
      `display: flex; ` +
      `flex-direction: row; ` +
      `margin: 0; ` +
      `padding: 0 var(${cssVariableName.padding}); ` +
      `list-style: none; ` +
      `}`
    )
  }

  private createColumnStyles = (): string => {
    return (
      `.${this.gridClassName} .${className.column} {` +
      `width: 100%; ` +
      `background: var(${cssVariableName.color});` +
      `opacity: 0.5; ` +
      `} ` +
      `.${this.gridClassName} .${className.column}:not(:first-of-type) {` +
      `  margin-left: var(${cssVariableName.gutter}); ` +
      `}`
    )
  }

  private mediaQueryStyles = (
    mq: number,
    selector: string,
    styling: string,
    minWidth: boolean = true
  ): string => {
    const width = minWidth ? 'min-width' : 'max-width'
    return `@media screen and (${width}: ${mq}px) { ${selector} { ${styling} }}`
  }

  public destruct = (): void => {
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}

export default GridChecker
