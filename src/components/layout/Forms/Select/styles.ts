/* eslint-disable @typescript-eslint/no-explicit-any */

const cssStyles = {
  colorForeground: '#180202',
  colorForegroundDim: '#798177',
  colorBackground1: '#ffffff',
  colorBackground2: '#fafafa',
  colorBackground3: '#f7f7f7',
  colorPrimary: '#B1D800',
  colorAccent: '#B1D800',
  colorDanger: '#d32f2f',
  colorBorder: '#dcdfd8',
  sizeInputHeight: '5rem',
  spacing2: '0.8rem',
  radiusM: '1.6rem',
  spacing3: '1.2rem',
  spacing4: '1.6rem'
};

export const selectStyles = (hasError: boolean) => {
  const isDark = false;

  return {
    container: (base: any) => ({
      ...base,
      width: '100%',
      // minWidth: '29.5rem',
      height: '5rem'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: cssStyles.colorForegroundDim,
      fontSize: '1em',
      fontWeight: 400,
      marginLeft: 0,
      marginRight: 0
    }),
    control: (base: any, state: any) => ({
      ...base,
      height: cssStyles.sizeInputHeight,
      padding: `0 ${cssStyles.spacing2}`,
      fontWeight: 400,
      outline: 'none',
      fontSize: '1em',
      borderRadius: cssStyles.radiusM,
      width: '100%',
      backgroundColor: cssStyles.colorBackground1,
      borderColor: 'transparent',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: state.isFocused
        ? hasError
          ? `0 0 0 .1rem ${cssStyles.colorDanger}`
          : `0 0 0 .1rem ${cssStyles.colorPrimary}`
        : 0,
      border: hasError ? `.1rem solid ${cssStyles.colorDanger}` : `.1rem solid ${cssStyles.colorBorder}`,
      '&:hover': {
        borderColor: 'none'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      marginLeft: 0,
      marginRight: 0,
      color: cssStyles.colorForeground,
      fontSize: '1em',
      fontWeight: 400
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: `${cssStyles.colorBorder}`,
      display: 'none'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: cssStyles.colorAccent
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: cssStyles.colorBackground1,
      border: isDark ? '1px solid #3c3c3d' : '',
      borderRadius: '1rem',
      overflow: 'auto'
    }),
    option: (base: any, state: any) => ({
      ...base,
      padding: `${cssStyles.spacing3} ${cssStyles.spacing4}`,
      paddingLeft: state.data?.depth ? `${15 * (state.data?.depth + 1)}px` : `${cssStyles.spacing4}`,
      position: 'relative',
      color: cssStyles.colorForeground,
      backgroundColor: cssStyles.colorBackground1,

      ':hover': {
        cursor: 'pointer',
        background: cssStyles.colorBackground3
      },

      ':before': {
        borderRadius: '0 0 0 .4rem',
        border: `.2rem solid ${cssStyles.colorBorder}`,
        borderTop: 'none',
        borderRight: 'none',
        content: '" "',
        display: state.data?.depth ? 'block' : 'none',
        height: 12,
        width: `${13 * state.data?.depth}px`,
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)'
      }
    })
  };
};
