//React tech stack
import React from 'react';

//组件不涉及ajax，都是拿到数据直接渲染
import styles from "./index.scss";//如果文件后缀是.scss?mc ， 表示打包的时候走px2rem插件打包，会把所有的px转成rem

export default class StudyPlan extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {
            items
        } = this.props;
        items=items||[];
        return (
            <div className={styles.root}>
                <ul>
                    {
                        items.map((item, index) => {
                            return (
                                <li className={styles[item.className]} key={index}>
                                    {item.name}
                                </li>
                            );
                        })
                    }
                </ul>
                <div>
                </div>
            </div>
        );
    }
}
