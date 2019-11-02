import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";
import { StripeProvider } from 'react-stripe-elements';

export default function Pay(props) {
    const [data, setData] = useState(false);
    useEffect(() => {
        window.axios.get('/api/order/get/'+props.match.params.id).then((res)=>{
            setData(res.data);
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
    },[]);

    if(data) {
        if(data.pay==='card') {
            return (
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <Typography variant="h4" component="h1">お支払画面</Typography>
                    </CardContent>
                </Card>
            );
        } else {
            return (
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <Typography variant="h4" component="h1">支払い確認画面</Typography>
                        <Typography variant="subtitle2" component="p">料金をお支払の上この画面を学生にお見せください。(ご提示いただけなかった場合発送できません)</Typography>
                        <Typography variant="h3" component="h1">{data.confirm}</Typography>
                    </CardContent>
                </Card>
            );
        }
    } else {
        return (
            <Card style={{margin: '2vw'}}>
                <CardContent>
                    <Typography variant="h4" component="h1">読み込み中</Typography>
                </CardContent>
            </Card>
        );
    }
}
