import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";

export default function Pay(props) {
    const [data, setData] = useState(null);
    useEffect(() => {
        window.axios.get('/api/order/get/'+props.match.params.id).then((res)=>{
            setData(res.data.confirm);
        }).catch((err)=>{
            if(err.code === 'ECONNABORTED') {
                alert('時間切れです。再度処理を実行してください。');
            } else {
                if(err.response.status===400) {
                    alert(err.response.data.error);
                }
                if(err.response.status===500) {
                    alert('問題が発生しました。管理者にお問い合わせください。');
                }
            }
        });
    });
    return (
        <Card style={{margin: '2vw'}}>
            <CardContent>
                <Typography variant="h4" component="h1">支払い確認画面</Typography>
                <Typography variant="subtitle2" component="p">料金をお支払の上この画面を学生にお見せください。(ご提示いただけなかった場合発送できません)</Typography>
                <Typography variant="h3" component="h1">{data}</Typography>
            </CardContent>
        </Card>
    );
}
