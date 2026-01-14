import style from './KnowledgeScroll.module.scss'
const KnowledgeScroll = () => {
    // const fetchKnowledge = async() => {
    //     const res = await 
    // }
    return(
        <div className={style.container}>
            <h2>Najnowsze <span className={style.greenText}>publikacje</span></h2>
        </div>
    )
}

export default KnowledgeScroll;