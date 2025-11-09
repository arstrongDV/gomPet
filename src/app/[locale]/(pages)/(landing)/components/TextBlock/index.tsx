import style from './TextBlock.module.scss'

const TextBlock = () => {
    return(
        <div className={style.textBlock}>
        <h2><span className={style.greenText}>Jesteśmy</span> tutaj, aby...</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim, purus eu condimentum hendrerit, 
          diam odio ullamcorper orci, sit amet congue nulla diam nec nisi. Suspendisse vitae laoreet elit, 
          tincidunt porttitor sem. Duis sed purus nisi. Aenean facilisis elit ac tellus consequat, at elementum erat faucibus. 
          Phasellus eu vehicula neque. Etiam vitae faucibus augue. Donec lobortis, erat vitae auctor pharetra, lorem tellus 
          tristique lorem, sit amet tincidunt neque ipsum vel lectus. Donec dapibus consectetur augue id maximus. 
          In vulputate rutrum lacus id sollicitudin. Aliquam quis volutpat ipsum. Nunc sed nibh tincidunt, 
          ornare velit et, hendrerit urna.</p>
      </div>
    )
}
export default TextBlock;