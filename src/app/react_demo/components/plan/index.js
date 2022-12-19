//组件不涉及ajax，都是拿到数据直接渲染
import styles from "./index.scss?mc";//不同后缀，解析不同的rem，每个页面的rem对应的px可能不一样"./index.scss?l"，解析的时候，做不同的处理
import React from 'react';

export default class StudyPlan extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {
            items
        } = this.props;

        return (
            <div className={styles.root}>
                <ul >
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
