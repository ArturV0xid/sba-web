import pandas as pd
import tabula

from datetime import datetime

codes = pd.read_csv("src/mcc.csv", sep=";").set_index("mcc").to_dict()["type"]


def parse_pdf(file, user, bank):
    df = pd.DataFrame()
    temp_df = pd.concat(tabula.read_pdf(file, lattice=True, pages="all"))

    if bank == "BNB":
        temp_df = temp_df[temp_df["МСС категория"] != "―"]
        df["date"] = temp_df["Дата и\rвремя\rсовершения"].apply(lambda x: datetime.strptime(x, "%d.%m.%Y %H:%M:%S").date())
        df["type"] = temp_df["МСС категория"].astype(int).map(codes)
        df[["amount", "currency"]] = temp_df["Сумма в\rвалюте\rоперации"].str.split(" ", expand=True)
        df["amount"] = df["amount"].str.replace(",", ".").astype(float)
        df["user_id"] = user.id

    return df